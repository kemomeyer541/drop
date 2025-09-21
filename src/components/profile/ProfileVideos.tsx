import React from "react";
import VideoFeed from "./VideoFeed";

const sampleVideos = [
  { id: "v1", src: "/videos/clip1.mp4", caption: "Studio rough cut" },
  { id: "v2", src: "/videos/clip2.mp4", caption: "Loop idea" },
  { id: "v3", src: "/videos/clip3.mp4", caption: "Lyric draft" },
];

export default function ProfileVideos() {
  return (
    <div className="relative">
      <VideoFeed items={sampleVideos} />
    </div>
  );
}

