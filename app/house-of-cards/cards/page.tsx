import { DbCard } from "@lib/Database";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/headers";
import styles from "./page.module.scss";
import Tooltip from "@components/Common/Tooltip";

export default async function HouseOfCardsWrapper() {
  const supabase = createServerComponentSupabaseClient({ headers, cookies });

  const res = await supabase.from("hoc_cards").select().returns<DbCard[]>();
  const cards = res.data!.sort((a, b) => a.id - b.id);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>{"ID"}</th>
          <th>{"Image"}</th>
          <th>{"Name"}</th>
          <th>
            <span data-tooltip-id="nugget-cost">{"NC"}</span>
            <Tooltip id="nugget-cost" content="Nugget Cost" />
          </th>
          <th>
            <span data-tooltip-id="attack-points">{"AP"}</span>
            <Tooltip id="attack-points" content="Attack Points" />
          </th>
          <th>
            <span data-tooltip-id="health-points">{"HP"}</span>
            <Tooltip id="health-points" content="Health Points" />
          </th>
          <th>{"Description"}</th>
        </tr>
      </thead>
      <tbody>
        {cards.map(card => (
          <tr key={card.id}>
            <td className={styles.alignRight}>{card.id}</td>
            <td className={styles.imageCell}>
              <div className={styles.imageWrapper}>
                <img className={styles.image} src={card.image ?? "/placeholder-10-square.png"} alt="" />
              </div>
            </td>
            <td>{card.name}</td>
            <td className={styles.stat}>{card.cost}</td>
            <td className={styles.stat}>{card.attack}</td>
            <td className={styles.stat}>{card.health}</td>
            <td dangerouslySetInnerHTML={{ __html: card.description }} />
          </tr>
        ))}
      </tbody>
    </table>
  );
}
