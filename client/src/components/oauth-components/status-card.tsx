import { type ReactNode } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  type VariantOpts,
} from '../ui/card';

type StatusCardProps = {
  title: string;
  description: string;
  variant: VariantOpts['variant'];
  icon?: ReactNode;
};

const StatusCard = ({ title, description, variant, icon }: StatusCardProps) => {
  return (
    <Card variant={variant} className="w-full max-w-lg sm:max-w-lg">
      <CardHeader>
        {icon && <div className="text-primary">{icon}</div>}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default StatusCard;
