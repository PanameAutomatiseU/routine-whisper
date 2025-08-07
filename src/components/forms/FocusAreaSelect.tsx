import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

const FOCUS_AREAS = [
  'Physical', 'Social', 'Mental', 'Spiritual', 
  'Creative', 'Professional', 'Financial', 'Environmental'
];

interface FocusAreaSelectProps {
  value: string[];
  onChange: (areas: string[]) => void;
  maxSelection?: number;
}

export function FocusAreaSelect({ value, onChange, maxSelection = 8 }: FocusAreaSelectProps) {
  const toggleArea = (area: string) => {
    if (value.includes(area)) {
      onChange(value.filter(a => a !== area));
    } else if (value.length < maxSelection) {
      onChange([...value, area]);
    }
  };

  const removeArea = (area: string) => {
    onChange(value.filter(a => a !== area));
  };

  return (
    <Card className="card-gradient border-border">
      <CardHeader>
        <CardTitle className="text-lg">Focus Areas</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select up to {maxSelection} areas you want to focus on today
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected areas */}
        {value.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected ({value.length}/{maxSelection}):</p>
            <div className="flex flex-wrap gap-2">
              {value.map((area) => (
                <Badge 
                  key={area} 
                  variant="default" 
                  className="glow-primary transition-smooth"
                >
                  {area}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0 w-4 h-4 hover:bg-transparent"
                    onClick={() => removeArea(area)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Available areas */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Available areas:</p>
          <div className="grid grid-cols-2 gap-2">
            {FOCUS_AREAS.filter(area => !value.includes(area)).map((area) => (
              <Button
                key={area}
                variant="outline"
                size="sm"
                onClick={() => toggleArea(area)}
                disabled={value.length >= maxSelection}
                className="transition-smooth hover:bg-primary/10 hover:border-primary"
              >
                {area}
              </Button>
            ))}
          </div>
        </div>

        {value.length >= maxSelection && (
          <p className="text-xs text-warning">
            Maximum selection reached. Remove an area to add a different one.
          </p>
        )}
      </CardContent>
    </Card>
  );
}