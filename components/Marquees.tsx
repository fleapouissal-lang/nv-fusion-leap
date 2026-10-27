import { Fragment } from "react";

const words = ["Branding", "Digital", "Créativité", "Stratégie", "Innovation", "Performance"];

export default function Marquees() {
  return (
    <>
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track" id="mq1">
          {[0, 1].map((k) =>
            words.map((w, i) => (
              <Fragment key={`${k}-${i}`}>
                <span className={i % 2 ? "solid" : undefined}>{w}</span>
                <span className="star">✳</span>
              </Fragment>
            ))
          )}
        </div>
      </div>
    </>
  );
}
