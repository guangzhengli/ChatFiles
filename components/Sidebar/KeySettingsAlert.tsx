import {KeyConfiguration} from "@/types";
import {FC, useState} from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Props {
    onCancellation: () => void;
    onContinue: () => void;
}

export const KeySettingsAlertDialog: FC<Props> = ({
    onCancellation,
    onContinue,
}) => {
    return (
        <>
            <AlertDialog open={true}>
                <AlertDialogContent >
                    <AlertDialogHeader>
                        <AlertDialogTitle>You need to configure the OpenAI key for use.</AlertDialogTitle>
                        <AlertDialogDescription>
                            This is an open-source project and we need your own key. We will not store your key, or you can set up the ChatFiles service by yourself.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={onCancellation}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onContinue}>Setup</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}