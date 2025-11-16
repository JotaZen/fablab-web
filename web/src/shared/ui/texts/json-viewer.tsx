"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";
import { Button } from "@/shared/ui/buttons/button";

interface JsonViewerProps {
  data: unknown;
  title?: string;
  className?: string;
}

export function JsonViewer({ data, title = "JSON Response", className = "" }: JsonViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`border rounded-lg bg-muted/30 ${className}`}>
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <span className="font-medium text-sm">{title}</span>
          <span className="text-xs text-muted-foreground">
            ({typeof data === 'object' && data !== null ? Object.keys(data).length : 0} fields)
          </span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className="h-6 px-2"
        >
          {copied ? (
            <Check className="w-3 h-3" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="border-t">
          <pre className="p-4 text-xs overflow-auto max-h-96 bg-background/50">
            <code className="text-foreground">
              {jsonString}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}
