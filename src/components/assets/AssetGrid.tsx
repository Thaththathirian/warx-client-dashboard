import { useAssetStore, Asset } from "@/store/assetStore";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface AssetGridProps {
  onAssetClick?: (asset: Asset) => void;
}

export function AssetGrid({ onAssetClick }: AssetGridProps) {
  const { assets, isLoading, selectAsset } = useAssetStore();
  const navigate = useNavigate();

  useEffect(() => {
    // This will show the fallback when images fail to load
    const checkImages = () => {
      document.querySelectorAll("img").forEach((img) => {
        const fallback = document.getElementById(`fallback-${img.dataset.id}`);
        if (img.complete && img.naturalHeight === 0 && fallback) {
          fallback.classList.remove("hidden");
        }
      });
    };

    // Run once on mount and then periodically to catch late-loading images
    checkImages();
    const interval = setInterval(checkImages, 1000);
    return () => clearInterval(interval);
  }, [assets]);

  const handleAssetClick = (asset: Asset) => {
    selectAsset(asset);
    if (onAssetClick) {
      onAssetClick(asset);
    } else {
      navigate(`/assets/${asset.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="h-40 bg-gray-200 animate-pulse" />
            <CardContent className="p-4">
              <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
          <h3 className="text-xl font-semibold">No assets found</h3>
          <p className="text-muted-foreground">
            There are no content assets available for monitoring.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assets.map((asset) => {
        const startDate = new Date(asset.start_date);
        const endDate = new Date(asset.end_date);

        return (
          <Card
            key={asset.id}
            className="overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="h-40 bg-gray-100 relative flex items-center justify-center overflow-hidden">
              {asset.image ? (
                <img
                  src={asset.image}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Hide the image if it fails to load
                    const img = e.target as HTMLImageElement;
                    img.style.display = "none";
                    // Show the fallback
                    const fallback = img.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = "flex";
                    }
                  }}
                />
              ) : null}

              {/* Fallback that shows when there's no image or when image fails to load */}
              <div
                className={`flex flex-col items-center justify-center text-muted-foreground ${
                  asset.image ? "hidden" : "flex"
                }`}
                style={asset.image ? { display: "none" } : { display: "flex" }}
              >
                <ImageIcon className="h-10 w-10 mb-2" />
                <span>No image</span>
              </div>

              <div className="absolute top-2 right-2">
                <Badge
                  variant={asset.status === "active" ? "success" : "outline"}
                >
                  {asset.status}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-1 line-clamp-1">
                {asset.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {asset.description || "No description available"}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>
                  {startDate.toLocaleDateString()} -{" "}
                  {endDate.toLocaleDateString()}
                </span>
              </div>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleAssetClick(asset)}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
