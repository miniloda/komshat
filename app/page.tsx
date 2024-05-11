import Participants from './components/Home/Participants'
import Theme from './components/Theme'
import HackathonButtons from './components/Home/HackathonButtons'
import { collection, query, where, limit, getDocs } from 'firebase/firestore'
import { Metadata, ResolvingMetadata } from 'next'
import db from './firebase/db'
import { ProjectInterface } from './types/ProjectInterface'
import { genericMetadata } from './constants/metadata'
import { GenerateMetadataInterface } from './types/metadata'

export async function generateMetadata(
    { searchParams }: GenerateMetadataInterface,
    parent: ResolvingMetadata
): Promise<Metadata> {
    if (!searchParams?.projectID || !searchParams?.hackathonID) {
        return genericMetadata
    }

    const projectsCollectionRef = collection(db, 'projects')

    const q = query(
        projectsCollectionRef,
        where('hackathonID', '==', searchParams.hackathonID),
        where('projectID', '==', searchParams.projectID),
        limit(1)
    )

    const results = await getDocs(q)

    if (results.empty) {
        return genericMetadata
    }

    const project = results.docs[0].data() as ProjectInterface

    return {
        title: project.title,
        description: project.description,
        openGraph: {
            title: project.title,
            description: project.description,
            siteName: 'komshat',
            type: 'article',
            images: [
                {
                    url: project.images[0].url,
                },
            ],
            locale: 'en_US',
        },
        icons: {
            icon: '/icon.png',
        },
    }
}

export default function Home() {
    return (
        <>
            <main className="flex items-center gap-20 overflow-hidden px-5 pb-20 pt-10 sm:px-14">
                <div className="min-w-[50%]">
                    <h1 className="text-4xl font-bold sm:text-5xl">
                        Weekly Hackathons
                    </h1>
                    <Theme />
                    <HackathonButtons />
                </div>
                <aside className="marquee hidden max-h-[500px] flex-1 items-center overflow-hidden text-[500px] font-extrabold lg:flex">
                    <p>komshat</p>
                </aside>
            </main>
            <Participants />
        </>
    )
}
