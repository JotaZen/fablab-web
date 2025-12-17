import { PostDetailPage } from "@/features/blog/presentation/pages/post-detail-page";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    // Metadata estática por ahora para evitar error de chunks con Turbopack
    return {
        title: `${slug.replace(/-/g, ' ')} | Blog FabLab INACAP`,
        description: "Lee este artículo en el blog del FabLab INACAP Los Ángeles.",
        openGraph: {
            title: "Blog FabLab INACAP",
            type: "article",
            locale: "es_CL",
        },
    };
}

export default async function BlogPostRoute({ params }: Props) {
    const { slug } = await params;

    return <PostDetailPage slug={slug} />;
}
