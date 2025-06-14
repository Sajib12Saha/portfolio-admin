import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { z } from "zod";


const singleSocialLinkSchema = z.object({
  platformName: z.string().min(1, "Platform is required"),
  platformLink: z.string().url("Invalid URL"),
});

const platforms = [
  "facebook",
  "instagram",
  "linkedin",
  "fiverr",
  "upwork",
  "freelancers",
  "youtube",
  "github",
];

type SocialLink = z.infer<typeof singleSocialLinkSchema>;

interface Props {
  onChange: (links: SocialLink[]) => void;
  value:SocialLink[]
  error?: string;
}
export const SocialAdder = ({ onChange, error, value }: Props) => {
  const [platformName, setPlatformName] = useState("");
  const [platformLink, setPlatformLink] = useState("");
  const [localErrors, setLocalErrors] = useState<{
    platformName?: string;
    platformLink?: string;
  }>({});

  const handleAdd = () => {
    const validation = singleSocialLinkSchema.safeParse({
      platformName,
      platformLink,
    });

    if (!validation.success) {
      const formatted = validation.error.format();
      setLocalErrors({
        platformName: formatted.platformName?._errors[0],
        platformLink: formatted.platformLink?._errors[0],
      });
      return;
    }

    const newLinks = [...value, { platformName, platformLink }];
    onChange(newLinks); // pass updated list to parent
    setPlatformName("");
    setPlatformLink("");
    setLocalErrors({});
  };

  const removeLink = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-1 w-full md:w-1/3">
          <Select value={platformName} onValueChange={setPlatformName}>
            <SelectTrigger>
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent side="top">
              {platforms.map((p) => (
                <SelectItem
                  key={p}
                  value={p}
                  className="font-semibold capitalize"
                >
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {localErrors.platformName && (
            <p className="text-destructive text-sm">{localErrors.platformName}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 w-full md:w-2/3">
          <Input
            placeholder="https://your-link.com"
            value={platformLink}
            onChange={(e) => setPlatformLink(e.target.value)}
            className={localErrors.platformLink ? "border border-destructive" : ""}
          />
          {localErrors.platformLink && (
            <p className="text-destructive text-sm">{localErrors.platformLink}</p>
          )}
        </div>

        <Button onClick={handleAdd} type="button" className="self-end">
          Add
        </Button>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {value.map((link, i) => (
        <div key={i} className="flex gap-x-2 overflow-hidden flex-wrap items-center py-2">
          <span className="text-base font-semibold capitalize">
            {link.platformName}
          </span>
          <Link href={link.platformLink} className="text-primary underline break-all">
            {link.platformLink}
          </Link>
          <div
            className="p-1.5 rounded-full shadow cursor-pointer hover:bg-background/65 transition-all"
            onClick={() => removeLink(i)}
          >
            <Trash2 className="size-4 text-destructive" />
          </div>
        </div>
      ))}
    </div>
  );
};
