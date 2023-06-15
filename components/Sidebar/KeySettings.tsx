import { FC, MouseEventHandler, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { KeyConfiguration, ModelType } from '@/types';

interface Props {
    keyConfiguration: KeyConfiguration;
    onKeyConfigrationChange: (keySettings: KeyConfiguration) => void;
    keyConfigurationButtonRef: React.RefObject<HTMLButtonElement>;
}

export const KeySettings: FC<Props> = ({
    keyConfiguration,
    onKeyConfigrationChange,
    keyConfigurationButtonRef,
}) => {
    const [fromkeyConfigration, setFromKeyConfigration] = useState<KeyConfiguration>({
        apiType: keyConfiguration.apiType,
        apiKey: keyConfiguration.apiKey,
        azureApiKey: keyConfiguration.azureApiKey,
        azureInstanceName: keyConfiguration.azureInstanceName,
        azureApiVersion: keyConfiguration.azureApiVersion,
        azureDeploymentName: keyConfiguration.azureDeploymentName,
        azureEmbeddingDeploymentName: keyConfiguration.azureEmbeddingDeploymentName,
    })

    const handleOpenAISubmit = () => {
        fromkeyConfigration.apiType = ModelType.OPENAI;
        onKeyConfigrationChange(fromkeyConfigration);
    };

    const handleAzureOpenAISubmit = () => {
        fromkeyConfigration.apiType = ModelType.AZURE_OPENAI;
        onKeyConfigrationChange(fromkeyConfigration);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFromKeyConfigration({
          ...fromkeyConfigration,
          [event.target.name]: event.target.value,
        });
    };

    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <Button ref={keyConfigurationButtonRef} className="w-64 dark:border-gray-50" variant="outline">OpenAI API Key Settings</Button>
                </SheetTrigger>
                <SheetContent position="left" size="sm">
                    <SheetHeader>
                    <SheetTitle>OpenAI Key Configuration</SheetTitle>
                    </SheetHeader>
                    <Tabs defaultValue="openai" className="w-full mt-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="openai">OpenAI</TabsTrigger>
                            <TabsTrigger value="azure openai">Azure OpenAI</TabsTrigger>
                        </TabsList>
                        <TabsContent value="openai">
                            <Card>
                            <CardHeader>
                                <CardTitle>OpenAI</CardTitle>
                                <CardDescription className='pt-4'>
                                Make changes to your OpenAI Key here. Click save when you are done. We will not store your API Key.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                <Label htmlFor="name">Key</Label>
                                <Input id="openaieky" type="password" placeholder="sk-xxx" name="apiKey" value={fromkeyConfigration.apiKey} onChange={handleChange}/>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <SheetClose asChild>
                                    <Button className="mx-auto mt-4 w-64" type="submit" onClick={handleOpenAISubmit}>Save</Button>
                                </SheetClose>
                            </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="azure openai">
                            <Card>
                            <CardHeader>
                                <CardTitle>Azure OpenAI</CardTitle>
                                <CardDescription className='pt-4'>
                                Make changes to your Auzre OpenAI Configuration here. Click save when you are done. We will not store your API Key.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                <Label htmlFor="current">API Key</Label>
                                <Input id="current" type="password" placeholder='***' name="azureApiKey" value={fromkeyConfigration.azureApiKey} onChange={handleChange}/>
                                </div>
                                <div className="space-y-1">
                                <Label htmlFor="name">Instance Name</Label>
                                <Input id="name" placeholder="name" name="azureInstanceName" value={fromkeyConfigration.azureInstanceName} onChange={handleChange}/>
                                </div>
                                <div className="space-y-1">
                                <Label htmlFor="name">API Version</Label>
                                <Input id="name" placeholder="2023-05-15" name="azureApiVersion" value={fromkeyConfigration.azureApiVersion} onChange={handleChange}/>
                                </div>
                                <div className="space-y-1">
                                <Label htmlFor="name">Deployment Model Name</Label>
                                <Input id="name" placeholder="gpt-35-turbo" name="azureDeploymentName" value={fromkeyConfigration.azureDeploymentName} onChange={handleChange}/>
                                </div>
                                <div className="space-y-1">
                                <Label htmlFor="name">Embeddings Deployment Model Name</Label>
                                <Input id="name" placeholder="text-embedding-ada-002" name="azureEmbeddingDeploymentName" value={fromkeyConfigration.azureEmbeddingDeploymentName} onChange={handleChange}/>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <SheetClose asChild>
                                    <Button className="mx-auto mt-4 w-64" type="submit" onClick={handleAzureOpenAISubmit}>Save</Button>
                                </SheetClose>
                            </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </SheetContent>
            </Sheet>
        </>

    )
}