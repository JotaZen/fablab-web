import { BlogDashboard } from '@/features/blog/presentation/pages/blog-dashboard';

export const metadata = {
  title: 'Blog - Admin FabLab',
  description: 'Gestión de posts del blog del FabLab',
};

export default function BlogAdminPage() {
  return <BlogDashboard />;
}
