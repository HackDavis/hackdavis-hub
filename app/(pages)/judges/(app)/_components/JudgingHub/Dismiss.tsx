import styles from './ViewProjects.module.scss';

export default function Dismiss() {
  function dismiss() {
    const x = document.getElementById('dismiss');
    if (x && x.style.display === 'none') {
      x.style.display = 'block';
    }
  }
  return (
    <div className={styles.container} id="dismiss">
      <div className={styles.projects}>
        <h1>⌛ Waiting for next round...</h1>
        <p>
          Thank you for judging the demos. You are not assigned a panel for the
          next judging stage.
        </p>
        <button type="button" onClick={dismiss}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
