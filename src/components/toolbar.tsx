"use client";

import type { FC } from "react";
import {
  Type,
  ImagePlus,
  RotateCw,
  FlipHorizontal,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CanvasElement, BaseImage } from "@/lib/types";

interface ToolbarProps {
  onAddText: () => void;
  onAddImage: (src: string) => void;
  onDownload: () => void;
  baseImage: BaseImage;
  updateBaseImage: (updates: Partial<BaseImage["transform"]>) => void;
  selectedElement: CanvasElement | null;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
}

export const Toolbar: FC<ToolbarProps> = ({
  onAddText,
  onAddImage,
  onDownload,
  baseImage,
  updateBaseImage,
  selectedElement,
  updateElement,
  deleteElement,
}) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          onAddImage(e.target.result);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const selectedTextElement =
    selectedElement?.type === "text" ? selectedElement : null;

  return (
    <Card className="w-80 h-full flex flex-col shadow-lg rounded-none border-l-0 border-r">
      <CardHeader>
        <CardTitle>Tools</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto space-y-6">
        <div className="space-y-2">
          <h3 className="font-semibold text-muted-foreground">Add Elements</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={onAddText}>
              <Type className="mr-2 h-4 w-4" /> Text
            </Button>
            <Button variant="outline" asChild>
              <Label>
                <ImagePlus className="mr-2 h-4 w-4" /> Image
                <Input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Label>
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="font-semibold text-muted-foreground">Canvas Tools</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() =>
                updateBaseImage({ rotate: (baseImage.transform.rotate + 90) % 360 })
              }
            >
              <RotateCw className="mr-2 h-4 w-4" /> Rotate
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                updateBaseImage({ scaleX: baseImage.transform.scaleX * -1 })
              }
            >
              <FlipHorizontal className="mr-2 h-4 w-4" /> Flip
            </Button>
          </div>
        </div>

        <Separator />

        {selectedElement && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-muted-foreground">
                Edit Element
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => deleteElement(selectedElement.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {selectedTextElement && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text-content">Text</Label>
                  <Textarea
                    id="text-content"
                    value={selectedTextElement.text}
                    onChange={(e) =>
                      updateElement(selectedTextElement.id, { text: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="font-size">Font Size</Label>
                  <Input
                    id="font-size"
                    type="number"
                    value={selectedTextElement.fontSize}
                    onChange={(e) =>
                      updateElement(selectedTextElement.id, {
                        fontSize: parseInt(e.target.value, 10),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    type="color"
                    className="p-1 h-10"
                    value={selectedTextElement.color}
                    onChange={(e) =>
                      updateElement(selectedTextElement.id, { color: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
            {selectedElement.type === "image" && (
               <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Image selected. More editing options coming soon.</p>
               </div>
            )}
          </div>
        )}
      </CardContent>

      <div className="p-4 border-t">
        <Button className="w-full" onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" /> Download Image
        </Button>
      </div>
    </Card>
  );
};
