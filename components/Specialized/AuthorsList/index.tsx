"use client";
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from "@hello-pangea/dnd";
import { ImmerStateRecipe, ImmerStateSetter } from "@lib/hooks/useImmerState";
import { createContext, useCallback, useContext, useId, useMemo, useState } from "react";
import { reorder } from "@lib/utils/misc";
import Avatar from "@components/Common/Avatar";
import IconButton from "@components/Common/IconButton";
import Popup from "@components/Common/Popup";
import TextInput from "@components/Common/TextInput";
import DragHandle from "@components/Common/DragHandle";
import { RestModAuthor, useApi } from "@lib/API";
import styles from "./index.module.scss";
import clsx from "clsx";
import UserSearch from "@components/Specialized/UserSearch";
import { DbUser } from "@lib/Database";
import Icon from "@components/Common/Icon";

type RestAuthor = RestModAuthor;

interface AuthorsListContext {
  listId: string;
  authors: RestAuthor[];
  mutateAuthors: ImmerStateSetter<RestAuthor[]>;
  isEditing: boolean;
  hasChanges: boolean;
}
const AuthorsListContext = createContext<AuthorsListContext | null>(null);

export interface AuthorsListProps {
  authors: RestModAuthor[];
  mutateAuthors?: ImmerStateSetter<RestAuthor[]>;
  isEditing?: boolean;
  hasChanges?: boolean;
  mod_id: number;
}

export default function AuthorsList({
  authors: unsorted,
  mutateAuthors,
  isEditing,
  hasChanges,
  mod_id,
}: AuthorsListProps) {
  const listId = useId();
  const authors = useMemo(() => unsorted.slice().sort((a, b) => a.order - b.order), [unsorted]);

  const context = useMemo<AuthorsListContext>(() => {
    return {
      listId,
      authors,
      mutateAuthors: mutateAuthors ?? (() => {}),
      isEditing: isEditing ?? false,
      hasChanges: hasChanges ?? false,
    };
  }, [authors, mutateAuthors, isEditing, hasChanges]);

  const onDragEnd = useCallback<OnDragEndResponder>(
    e => mutateAuthors?.(() => reorder(e, authors, "order")),
    [authors],
  );

  function addAuthor(user: DbUser) {
    mutateAuthors?.(authors => {
      const author: RestModAuthor = {
        id: undefined!,
        mod_id: mod_id,
        user_id: user.id,
        user: user as any,
        is_creator: false,
        can_edit: false,
        can_see: true,
        created_at: new Date().toISOString(),
        edited_at: null,
        credit: null,
        order: authors.length,
      };
      return [...authors, author];
    });
  }

  const [term, setTerm] = useState("");

  return (
    <AuthorsListContext.Provider value={context}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={listId}>
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps} className={styles.authorList}>
              {authors.map((author, i) => (
                <Author author={author} index={i} key={author.user_id} />
              ))}
              {provided.placeholder}
              {isEditing && (
                <UserSearch
                  className={styles.addAuthorButton}
                  term={[term, setTerm]}
                  onClick={addAuthor}
                  disabled={user => authors.some(a => a.user_id === user.id)}
                >
                  <Icon type="add" />
                  {"Add user"}
                </UserSearch>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </AuthorsListContext.Provider>
  );
}

export interface AuthorProps {
  author: RestModAuthor;
  index: number;
}

export function Author({ author, index }: AuthorProps) {
  const { listId, authors, mutateAuthors, isEditing, hasChanges } = useContext(AuthorsListContext)!;
  const [editorOpen, setEditorOpen] = useState(false);
  const me = useApi().currentUser;

  function mutateAuthor(recipe: ImmerStateRecipe<RestAuthor>) {
    mutateAuthors(authors => void recipe(authors.find(a => a.user_id === author.user_id)!));
  }
  function removeAuthor() {
    mutateAuthors(authors => authors.filter(a => a.user_id !== author.user_id));
  }

  const user = author.user;
  const itemId = `${listId}/${author.user_id}`;

  const canEditPerms = useMemo(() => {
    if (me?.is_admin) return true;
    if (!me || author.user_id === me.id || author.is_creator) return false;
    return authors.find(a => a.user_id === me.id)?.is_creator;
  }, [authors, author, me]);

  const canRemove = canEditPerms || author.user_id === me?.id;

  return (
    <>
      <Draggable draggableId={itemId} index={index} disableInteractiveElementBlocking isDragDisabled={!isEditing}>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={styles.authorWrapper}
            data-tooltip-id={itemId}
          >
            {isEditing && <DragHandle {...provided.dragHandleProps} />}
            <div className={styles.author} {...provided.dragHandleProps}>
              <Avatar
                src={user?.avatar_url}
                uid={user?.id}
                size={48}
                href={`/user/${user?.slug ?? user?.id}`}
                blank={isEditing || hasChanges}
              />

              <div className={clsx(styles.userInfo, author.credit && styles.withCredits)}>
                <span className={styles.username}>{user?.username ?? "..."}</span>
                {author.credit && (
                  <div className={styles.credits}>
                    {author.credit.split("\n").map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {isEditing && (
              <div className={styles.authorEditControls}>
                <IconButton type="edit" size={16} onClick={() => setEditorOpen(v => !v)} />
                <IconButton type="cross" size={16} disabled={!canRemove} onClick={removeAuthor} />
              </div>
            )}
          </div>
        )}
      </Draggable>
      {isEditing && (
        <Popup id={itemId} place="left" open={[editorOpen, setEditorOpen]}>
          {() => (
            <div className={styles.authorEditor}>
              <label>{"Credit"}</label>
              <TextInput
                value={author.credit}
                onChange={v => mutateAuthor(a => void (a.credit = v || null))}
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
