import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet'
import React, { useState } from 'react'
import GoogleIcon from '../icons/GoogleIcon'
import useUser from '../hooks/useUser'
import { Loader2, UserRound } from 'lucide-react'
import Image from 'next/image'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import auth from '../firebase/auth'
import { toast } from 'sonner'
import { toastError } from '@/lib/utils'
import { analytics } from '../firebase/firebase'
import { logEvent } from 'firebase/analytics'

const provider = new GoogleAuthProvider()

interface PropsInterface {
    children: React.ReactNode
    callback?: () => void
}

function ProfileSheet(props: Readonly<PropsInterface>) {
    const { children, callback } = props

    const user = useUser()
    const [isLoading, setIsLoading] = useState(false)

    async function signIn() {
        try {
            const log = await analytics

            if (log) {
                logEvent(log, 'login')
            }

            setIsLoading(true)
            await signInWithPopup(auth, provider)

            toast.info('Successfully logged-in.')

            if (callback) {
                callback()
            }
        } catch (error) {
            toastError(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Sheet>
            {children}
            <SheetContent>
                {user ? (
                    <>
                        <SheetHeader>
                            <SheetTitle>Profile</SheetTitle>
                        </SheetHeader>
                        <div className="mt-3 flex items-center gap-2">
                            {user.photoURL ? (
                                <div className="flex h-14 w-14 overflow-hidden rounded-full">
                                    <Image
                                        alt="profile picture"
                                        width="0"
                                        height="0"
                                        sizes="100vw"
                                        className="h-auto w-auto object-cover object-center shadow-md"
                                        src={user.photoURL}
                                    />
                                </div>
                            ) : (
                                <UserRound />
                            )}
                            <div>
                                <p>{user.displayName}</p>
                                <p className="text-xs text-gray-400">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        <Button
                            className="my-8 flex items-center gap-2"
                            onClick={() => auth.signOut()}
                        >
                            Log out
                        </Button>
                    </>
                ) : (
                    <>
                        <SheetHeader>
                            <SheetTitle>Sign In</SheetTitle>
                            <SheetDescription>
                                You are not currently logged in. To join this
                                week&apos;s hackathon, please sign in with your
                                UP email.
                            </SheetDescription>
                        </SheetHeader>
                        <Button
                            className="my-5 flex w-[189px] items-center gap-2"
                            disabled={isLoading}
                            onClick={() => signIn()}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    <GoogleIcon className="w-5 fill-white" />
                                    Sign in with Google
                                </>
                            )}
                        </Button>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}

export default ProfileSheet
