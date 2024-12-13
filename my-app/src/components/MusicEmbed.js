export default function MusicEmbed({ musicUrl }) {
  if (!musicUrl || typeof musicUrl !== "string") {
    console.error("Invalid musicUrl:", musicUrl);
    return null;
  }

  let iframeSrc = "";
  let iframeHeight = "200";

  const isYouTube = musicUrl.includes("youtube.com");
  const isSpotify = musicUrl.includes("spotify.com");
  const isSoundCloud = musicUrl.includes("soundcloud.com");

  if (isYouTube) {
    const videoId = new URL(musicUrl).searchParams.get("v");
    iframeSrc = `https://www.youtube.com/embed/${videoId}`;
    iframeHeight = "340";
  } else if (isSpotify) {
    const trackId = musicUrl.split("/").pop().split("?")[0];
    iframeSrc = `https://open.spotify.com/embed/track/${trackId}`;
    iframeHeight = "80";
  } else if (isSoundCloud) {
    iframeSrc = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
      musicUrl
    )}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
    iframeHeight = "400";
  }

  return (
    <div className="music-embed">
      {iframeSrc && (
        <iframe
          src={iframeSrc}
          width="100%"
          height={iframeHeight}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Music Embed"
        ></iframe>
      )}
    </div>
  );
}
