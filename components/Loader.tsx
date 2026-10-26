import Image from "next/image";

export default function Loader() {
  return (
    <div id="loader" aria-hidden="true">
      <Image className="mark" src="/logo-mark.png" alt="" width={235} height={228} priority />
      <div className="bar" />
    </div>
  );
}
