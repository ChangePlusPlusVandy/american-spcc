import styles from './Divider.module.css';

interface DividerProps {
  text?: string;
}

function Divider({ text }: DividerProps) {
  return (
    <div className={styles.divider}>
      <div className={styles.line}></div>
      {text && <span className={styles.text}>{text}</span>}
      <div className={styles.line}></div>
    </div>
  );
}

export default Divider;
