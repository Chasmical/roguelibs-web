"use client";
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from "@hello-pangea/dnd";
import { ImmerStateRecipe, ImmerStateSetter } from "@lib/hooks/useImmerState";
import { createContext, useCallback, useContext, useId, useMemo, useState } from "react";
import { reorder } from "@lib/utils/misc";
import IconButton from "@components/Common/IconButton";
import Popup from "@components/Common/Popup";
import TextInput from "@components/Common/TextInput";
import DragHandle from "@components/Common/DragHandle";
import Button from "@components/Common/Button";
import Icon from "@components/Common/Icon";
import { RestReleaseFile, useApi } from "@lib/API";
import { DbReleaseFileType } from "@lib/Database";
import styles from "./index.module.scss";

interface FilesListContext {
  listId: string;
  files: RestReleaseFile[];
  mutateFiles?: ImmerStateSetter<RestReleaseFile[]>;
  isEditing?: boolean;
  hasChanges?: boolean;
  linkTargetBlank?: boolean;
}
const FilesListContext = createContext<FilesListContext | null>(null);

export interface DownloadsListProps {
  files: RestReleaseFile[];
  mutateFiles?: ImmerStateSetter<RestReleaseFile[]>;
  isEditing?: boolean;
  hasChanges?: boolean;
  release_id: number;
  linkTargetBlank?: boolean;
}

export default function DownloadsList({
  files: unsorted,
  mutateFiles,
  isEditing,
  hasChanges,
  linkTargetBlank,
}: DownloadsListProps) {
  const listId = useId();
  const files = useMemo(() => unsorted.slice().sort((a, b) => a.order - b.order), [unsorted]);

  const context = useMemo<FilesListContext>(() => {
    return {
      listId,
      files,
      mutateFiles,
      isEditing,
      hasChanges,
      linkTargetBlank,
    };
  }, [files, mutateFiles, isEditing, hasChanges, linkTargetBlank]);

  const onDragEnd = useCallback<OnDragEndResponder>(
    e => mutateFiles?.(() => reorder(e, files, "order")),
    [files, mutateFiles],
  );

  return (
    <FilesListContext.Provider value={context}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={listId}>
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps} className={styles.downloadList}>
              {files.map((file, i) => (
                <Download file={file} index={i} key={file.id} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </FilesListContext.Provider>
  );
}

export interface DownloadProps {
  file: RestReleaseFile;
  index: number;
}

export function Download({ file, index }: DownloadProps) {
  const { listId, mutateFiles, isEditing } = useContext(FilesListContext)!;
  const itemId = `${listId}/${file.id}`;

  const api = useApi();
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  function mutateFile(recipe: ImmerStateRecipe<RestReleaseFile>) {
    mutateFiles!(files => void recipe(files.find(f => f.id === file.id)!));
  }
  function removeFile() {
    mutateFiles!(files => files.filter(f => f.id !== file.id));
  }

  const download = useCallback(
    async (file: RestReleaseFile) => {
      try {
        setLoading(true);
        await api.downloadFile(file.upload);
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    },
    [api],
  );

  const className = {
    [DbReleaseFileType.Unknown]: undefined,
    [DbReleaseFileType.Plugin]: styles.downloadMain,
    [DbReleaseFileType.PatcherPlugin]: styles.downloadMain,
    [DbReleaseFileType.CorePlugin]: styles.downloadMain,
    [DbReleaseFileType.SpritePack]: styles.downloadMain,
    [DbReleaseFileType.Documentation]: styles.downloadDocumentation,
    [DbReleaseFileType.Extra]: styles.downloadText,
  }[file.type];

  return (
    <>
      <Draggable draggableId={itemId} index={index} disableInteractiveElementBlocking isDragDisabled={!isEditing}>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={styles.downloadWrapper}
            data-tooltip-id={itemId}
          >
            {isEditing && <DragHandle {...provided.dragHandleProps} />}
            <div className={styles.download} {...provided.dragHandleProps}>
              <Button className={className} onClick={() => download(file)}>
                <Icon type={loading ? "loading" : "download"} size={24} />
                {file.title || file.upload?.filename}
              </Button>
              {file.tooltip && <div className={styles.tooltip}>{file.tooltip}</div>}
            </div>
            {isEditing && (
              <div className={styles.downloadEditControls}>
                <IconButton type="edit" size={16} onClick={() => setEditorOpen(true)} />
                <IconButton type="cross" size={16} onClick={removeFile} />
              </div>
            )}
          </div>
        )}
      </Draggable>
      {isEditing && (
        <Popup id={itemId} place="left" open={[editorOpen, setEditorOpen]}>
          {() => (
            <div className={styles.downloadEditor}>
              <label>{"Title"}</label>
              <TextInput
                value={file.title}
                onChange={v => mutateFile(f => void (f.title = v || null))}
                placeholder={file.upload?.filename}
                error={value => {
                  if (value.length > 64) return `Exceeded length limit (${value.length}/64).`;
                }}
              />
              <label>{"Tooltip"}</label>
              <TextInput
                value={file.tooltip}
                onChange={v => mutateFile(f => void (f.tooltip = v || null))}
                placeholder={"Not specified"}
                error={value => {
                  if (value.length > 128) return `Exceeded length limit (${value.length}/128).`;
                }}
              />
            </div>
          )}
        </Popup>
      )}
    </>
  );
}
