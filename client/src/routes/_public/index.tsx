import { createFileRoute } from '@tanstack/react-router';
import Home from '@/components/section/home';

export const Route = createFileRoute('/_public/')({
  component: Home,
});
