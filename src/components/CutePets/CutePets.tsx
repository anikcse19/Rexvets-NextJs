import styles from "./cute-pets.module.css";

const CutePets = () => {
  return (
    <div className={styles.Petty}>
      <div
        className={styles.catty}
        style={{ position: "fixed", bottom: "-95px", left: "60px" }}
      >
        <div className={styles.ears1}></div>
        <div className={styles.head1}>
          <div className={styles.eyes1}></div>
          <div className={styles.nose1}></div>
        </div>
        <div className={styles.body1}>
          <div className={styles.leftPaw1}></div>
          <div className={styles.rightPaw1}></div>
        </div>
        <div className={styles.tail1}></div>
        <div className={styles.PRlaptop}>
          <div className={styles.PRscreen}></div>
          <div className={styles.PRkeyboard}></div>
        </div>
      </div>

      <div
        className={styles.doggy}
        style={{ position: "fixed", bottom: "-95px", right: "60px" }}
      >
        <div className={styles.ears2}></div>
        <div className={styles.head2}>
          <div className={styles.eyes2}></div>
          <div className={styles.nose2}></div>
        </div>
        <div className={styles.body2}>
          <div className={styles.leftPaw2}></div>
          <div className={styles.rightPaw2}></div>
        </div>
        <div className={styles.tail2}></div>
        <div className={styles.ORlaptop}>
          <div className={styles.ORscreen}></div>
          <div className={styles.ORkeyboard}></div>
        </div>
      </div>
    </div>
  );
};

export default CutePets;
