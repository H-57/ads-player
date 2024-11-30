import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-ads';
import 'videojs-ima';

const Ads = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const initializePlayer = () => {
      // Ensure we have a reference to the video element
      if (!videoRef.current) {
        console.error('Video ref is not available');
        return;
      }

      // Ensure a unique ID
      const videoId = 'content_video_' + Date.now();
      videoRef.current.id = videoId;

      // Ensure the parent div has an ID as well
      const containerRef = videoRef.current.closest('[data-vjs-player]');
      if (containerRef) {
        containerRef.id = videoId + '_container';
      }

      try {
        // Create the player
        const player = videojs(videoRef.current, {
          fluid: true,
          html5: {
            vhs: {
              overrideNative: true
            }
          },
          controls: true,
          preload: 'auto',
          sources: [{
            src: 'https://storage.googleapis.com/gvabox/media/samples/android.mp4',
            type: 'video/mp4'
          }]
        }, function() {
          // Player is ready
          const imaOptions = {
            id: videoId,
            adTagUrl: 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&vid=short_onecue&correlator=',
            
            // Explicitly set content element
            contentEl: document.getElementById(videoId),
            
            // Additional debugging options
            debug: true,
            
            // Ensure IMA plugin is initialized correctly
            adsRenderingSettings: {
              restoreCustomPlaybackStateOnAdBreakComplete: true
            }
          };

          // Initialize IMA plugin with explicit error handling
          try {
            this.ima(imaOptions);
          } catch (imaError) {
            console.error('IMA Plugin Initialization Error:', imaError);
          }
        });

        // Store player reference
        playerRef.current = player;
      } catch (error) {
        console.error('Video.js Player Initialization Error:', error);
      }
    };

    // Initialize player
    initializePlayer();

    // Cleanup
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.dispose();
        } catch (disposeError) {
          console.error('Player Dispose Error:', disposeError);
        }
        playerRef.current = null;
      }
    };
  }, []); // Empty dependency array

  return (
    <div>
      <div data-vjs-player>
        <video
          ref={videoRef}
         
          className="video-js vjs-default-skin"
          playsInline
          controls
        />
      </div>
    </div>
  );
};

export default Ads;