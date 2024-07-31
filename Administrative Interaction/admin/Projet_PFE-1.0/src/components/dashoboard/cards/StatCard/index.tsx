import React from "react";
import { Link } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

import styles from "./statcard.module.css";

interface StatCardProps {
  title: string;
  icon: string;
  link?: string;
  value: number | string;
  increaseCount?: number;
  decreaseCount?: number;
}

export const StatCard = ({ title, value, link, icon, increaseCount, decreaseCount }: StatCardProps) => {
  if (link) {
    return (
      <Link className={styles.stat_card_container} to={link}>
        <div className={styles.stat_card_text_container}>
          <span className={styles.stat_card_title}>{title}</span>
          {increaseCount !== undefined && decreaseCount !== undefined && (
            <div className={styles.stat_card_change_counts}>
              <FaArrowUp className={styles.increase_icon} />
              <span className={styles.increase_count}>{increaseCount}</span>
              <FaArrowDown className={styles.decrease_icon} />
              <span className={styles.decrease_count}>{decreaseCount}</span>
            </div>
          )}
          <span className={styles.stat_card_value}>{value}</span>
        </div>
        <div className={styles.stat_card_icon_container}>
          <img src={icon} alt={title} className={styles.stat_card_icon} />
        </div>
      </Link>
    );
  }

  return (
    <div className={styles.stat_card_container}>
      <div className={styles.stat_card_text_container}>
        <span className={styles.stat_card_title}>{title}</span>
        <span className={styles.stat_card_value}>{value}</span>
      </div>
      {increaseCount !== undefined && decreaseCount !== undefined && (
        <div className={styles.stat_card_change_counts}>
          <p>Changement des prix :</p>
          <FaArrowUp className={styles.increase_icon} />
          <span className={styles.increase_count}>{increaseCount}</span>
          <FaArrowDown className={styles.decrease_icon} />
          <span className={styles.decrease_count}>{decreaseCount}</span>
        </div>
      )}
      <div className={styles.stat_card_icon_container}>
        <img src={icon} alt={title} className={styles.stat_card_icon} />
      </div>
    </div>
  );
  
  
};
