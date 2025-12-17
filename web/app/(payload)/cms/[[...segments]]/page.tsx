
import type { Metadata } from 'next';
import config from '@payload-config';
import { getPayload } from 'payload';
import { notFound } from 'next/navigation';
import { RootPage, generatePageMetadata } from '@payloadcms/next/views';

interface Args {
    params: Promise<{
        segments: string[];
    }>;
    searchParams: Promise<{
        [key: string]: string | string[];
    }>;
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> =>
    generatePageMetadata({ config, params, searchParams });

const Page = async ({ params, searchParams }: Args) => {
    const result = await RootPage({ config, params, searchParams });
    return result;
};

export default Page;
