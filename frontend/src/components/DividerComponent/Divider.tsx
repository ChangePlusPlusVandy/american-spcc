import styles from './Divider.module.css';
import { type DividerProps } from './DividerDefinitions';

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