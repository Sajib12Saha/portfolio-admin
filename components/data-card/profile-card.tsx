import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileInput } from "@/types/type";

interface Props {
  profile: ProfileInput;
}

export const ProfileCard = ({ profile }: Props) => {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-x-4">
        <div  className="space-y-4 text-base text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">Name:</span> {profile.name}
        </p>
        <p>
          <span className="font-medium text-foreground">Email:</span> {profile.email}
        </p>
        <p>
          <span className="font-medium text-foreground">Phone:</span> {profile.phone}
        </p>
        <p>
          <span className="font-medium text-foreground">Profession:</span> {profile.profession}
        </p>
            <p>
          <span className="font-medium text-foreground">Profession Bio:</span> {profile.professionBio}
        </p>
        <p>
          <span className="font-medium text-foreground">Address:</span> {profile.address}
        </p>
        <p>
          <span className="font-medium text-foreground">Welcome Message:</span> {profile.welcomeMessage}
        </p>

               <div className="space-y-4">
          <h6 className="font-medium text-foreground ">Social Media:</h6>
          <div className="flex flex-col gap-y-2 ">
            {profile.socialMedia.map((sm, i) => (
              <p key={i} className="">
                <span className="text-foreground capitalize">{sm.platformName}:</span>{" "}
                <a
                  href={sm.platformLink}
                  className="text-primary underline break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {sm.platformLink}
                </a>
              </p>
            ))}
          </div>

        </div>

        {profile.metaDescription && (
          <div>
            <span className="font-medium text-foreground">Meta Description:</span> {profile.metaDescription}
          </div>
        )}


        {/* Image Previews */}
        <div className="space-y-2">
          <p className="font-medium text-foreground">Primary Image:</p>
          <Image
            src={profile.primaryImage}
            alt="Primary"
            width={400}
            height={200}
            className="rounded-md shadow-[3px_3px_3px_rgba(0,0,0,0.25)_inset,-1px_-1px_4px_rgba(255,255,255,0.8)_inset]  dark:shadow-[3px_3px_3px_rgba(0,0,0,0.25)_inset,-1px_-1px_4px_rgba(255,255,255,0.16)_inset] p-4"
          />
        </div>

        <div className="space-y-2">
          <p className="font-medium text-foreground">Secondary Image:</p>
          <Image
            src={profile.secondaryImage}
            alt="Secondary"
            width={400}
            height={200}
            className="rounded-md shadow-[3px_3px_3px_rgba(0,0,0,0.25)_inset,-1px_-1px_4px_rgba(255,255,255,0.8)_inset]  dark:shadow-[3px_3px_3px_rgba(0,0,0,0.25)_inset,-1px_-1px_4px_rgba(255,255,255,0.16)_inset] p-4"
          />
        </div>
          </div>

          <div className="space-y-4">
            
        {profile.metaImage && (
          <div className="space-y-2">
            <p className="font-medium text-foreground">Meta Image:</p>
            <Image
              src={profile.metaImage}
              alt="Meta"
              width={400}
              height={200}
              className="rounded-md shadow-[3px_3px_3px_rgba(0,0,0,0.25)_inset,-1px_-1px_4px_rgba(255,255,255,0.8)_inset]  dark:shadow-[3px_3px_3px_rgba(0,0,0,0.25)_inset,-1px_-1px_4px_rgba(255,255,255,0.16)_inset] p-4"
            />
          </div>
        )}

        {profile.openGraphImage && (
          <div className="space-y-2">
            <p className="font-medium text-foreground">Open Graph Image:</p>
            <Image
              src={profile.openGraphImage}
              alt="Open Graph"
              width={400}
              height={200}
              className="rounded-md shadow-[3px_3px_3px_rgba(0,0,0,0.25)_inset,-1px_-1px_4px_rgba(255,255,255,0.8)_inset]  dark:shadow-[3px_3px_3px_rgba(0,0,0,0.25)_inset,-1px_-1px_4px_rgba(255,255,255,0.16)_inset] p-4"
            />
          </div>
        )}

        {profile.twitterImage && (
          <div className="space-y-2">
            <p className="font-medium text-foreground">Twitter Image:</p>
            <Image
              src={profile.twitterImage}
              alt="Twitter"
              width={400}
              height={200}
              className="rounded-md shadow-[3px_3px_3px_rgba(0,0,0,0.25)_inset,-1px_-1px_4px_rgba(255,255,255,0.8)_inset]  dark:shadow-[3px_3px_3px_rgba(0,0,0,0.25)_inset,-1px_-1px_4px_rgba(255,255,255,0.16)_inset] p-4"
            />
          </div>
        )}
          </div>
      </CardContent>
    </Card>
  );
};
