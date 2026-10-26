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
      <div className="marquee marquee--logos" aria-label="Clients et partenaires">
        <div className="marquee__track" id="mq2">
          {[0, 1].map((k) =>
            Array.from({ length: 8 }, (_, i) => <span key={`${k}-${i}`}>Client {String(i + 1).padStart(2, "0")}</span>)
          )}
        </div>
        <p className="note">Logos clients — emplacements réservés en attente des assets officiels</p>
      </div>
    </>
  );
}
