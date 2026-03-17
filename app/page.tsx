import ExpandableGallery from "@/components/expandable-gallery"

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-transparent">
      {/* Top: white cloud fade — content fades into clouds when scrolling up */}
      <div
        className="fixed inset-x-0 top-0 z-40 h-28 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #ffffff 0%, #ffffff 15%, rgba(255,255,255,0.85) 35%, rgba(255,255,255,0.5) 55%, rgba(255,255,255,0.2) 75%, transparent 100%)",
        }}
        aria-hidden
      />
      {/* Stylish animated top edge */}
      <div
        className="fixed inset-x-0 top-0 z-50 h-1 pointer-events-none overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute inset-0 animate-[shimmer_3s_ease-in-out_infinite]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 25%, #ffffff 50%, rgba(255,255,255,0.6) 75%, transparent 100%)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>
      {/* Bottom: white cloud fade — content fades into clouds when scrolling down */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 h-28 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #ffffff 0%, #ffffff 15%, rgba(255,255,255,0.85) 35%, rgba(255,255,255,0.5) 55%, rgba(255,255,255,0.2) 75%, transparent 100%)",
        }}
        aria-hidden
      />
      <ExpandableGallery />
    </div>
  )
}