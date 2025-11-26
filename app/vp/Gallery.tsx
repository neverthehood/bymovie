import Image from "next/image";

export default function Gallery() {
  return (
    <section className="w-full py-20 px-6 md:px-20 bg-black text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1400px] mx-auto">
        
        <Image src="/gallery/vp1.jpg" alt="" width={800} height={600} className="w-full h-auto object-cover"/>
        <Image src="/gallery/vp2.jpg" alt="" width={800} height={600} className="w-full h-auto object-cover"/>
        <Image src="/gallery/vp3.jpg" alt="" width={800} height={600} className="w-full h-auto object-cover"/>
        <Image src="/gallery/vp4.jpg" alt="" width={800} height={600} className="w-full h-auto object-cover"/>

      </div>
    </section>
  );
}
