import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ToltecAgreement {
  key: 'toltec_word' | 'toltec_personal' | 'toltec_assume' | 'toltec_best';
  title: string;
  description: string;
}

const TOLTEC_AGREEMENTS: ToltecAgreement[] = [
  {
    key: 'toltec_word',
    title: 'Be impeccable with your word',
    description: 'Speak with integrity and say what you mean'
  },
  {
    key: 'toltec_personal',
    title: "Don't take anything personally",
    description: 'Nothing others do is because of you'
  },
  {
    key: 'toltec_assume',
    title: "Don't make assumptions",
    description: 'Find the courage to ask questions and express clearly'
  },
  {
    key: 'toltec_best',
    title: 'Always do your best',
    description: 'Your best changes moment to moment'
  }
];

interface ToltecAgreementsProps {
  values: {
    toltec_word: boolean;
    toltec_personal: boolean;
    toltec_assume: boolean;
    toltec_best: boolean;
    [key: string]: any;
  };
  onChange: (key: string, checked: boolean) => void;
}

export function ToltecAgreements({ values, onChange }: ToltecAgreementsProps) {
  return (
    <Card className="card-gradient border-border">
      <CardHeader>
        <CardTitle className="text-lg">The Four Agreements</CardTitle>
        <p className="text-sm text-muted-foreground">
          Commit to these agreements for personal transformation
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {TOLTEC_AGREEMENTS.map((agreement) => (
          <div key={agreement.key} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 border border-border/50 transition-smooth hover:bg-muted/70">
            <Checkbox
              id={agreement.key}
              checked={values[agreement.key] || false}
              onCheckedChange={(checked) => onChange(agreement.key, checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1 space-y-1">
              <Label 
                htmlFor={agreement.key} 
                className="text-sm font-medium cursor-pointer"
              >
                {agreement.title}
              </Label>
              <p className="text-xs text-muted-foreground">
                {agreement.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}