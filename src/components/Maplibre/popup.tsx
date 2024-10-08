/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
import React, { useContext, useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";

interface PopupProps {
  map: any;
  children?: React.ReactNode;
  disablePopup?: boolean;
  onFeatureClick?: (feature: any) => void;
  onMapClick?: (e: maplibregl.MapMouseEvent) => void;
}

let onclick: Function | null;

const Popup: React.FC<PopupProps> = ({
  map,
  disablePopup = false,
  onFeatureClick = () => {},
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  const [popupProperties, setPopupProperties] = useState<any>(null);

  useEffect(() => {
    if (!map) return;

    onclick = (e: maplibregl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point);
      if (features.length > 0) {
        if (!disablePopup) {
          onFeatureClick(features[0]);

          setPopupProperties(features[0]?.properties);

          new maplibregl.Popup({})
            .setLngLat(e.lngLat)
            .setDOMContent(popupRef.current!)
            .addTo(map);
        }
      }
    };

    map.on("click", onclick);
    return () => {
      map.off("click", onclick);
    };
  }, [map, disablePopup]);

  return (
    <div style={{ display: "none" }} className="mypop">
      {/* <div ref={popupRef}>{children}</div> */}
      <div
        ref={popupRef}
        className="px-1 max-h-64 !max-w-20 my-1.5 overflow-auto"
      >
        {popupProperties &&
          Object.keys(popupProperties).map((prop, i) => {
            return (
              <div className="flex even:bg-gray-200 " key={`prop-${i}`}>
                <span className="min-w-[120px] p-1 capitalize font-bold">
                  {prop}
                </span>
                <span className="p-1 flex-1 min-w-[140px] ">
                  {popupProperties[prop]}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Popup;
