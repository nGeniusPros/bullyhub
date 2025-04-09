import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect, type Option } from "@/components/ui/multi-select";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "@/components/ui/use-toast";

interface SocialMediaPostProps {
  dogId?: string;
  initialImages?: string[];
}

export default function SocialMediaPost({
  dogId,
  initialImages = [],
}: SocialMediaPostProps) {
  const [text, setText] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>(initialImages);
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const platformOptions: Option[] = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "twitter", label: "Twitter" },
    { value: "linkedin", label: "LinkedIn" },
  ];

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Generate hashtags
      const hashtagResponse = await fetch("/api/social/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const { hashtags } = await hashtagResponse.json();

      // Create the post
      const response = await fetch("/api/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          platforms,
          mediaUrls,
          scheduleDate,
          hashtags,
          dogId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      toast({
        title: "Success",
        description: "Your post has been published!",
      });

      // Reset form
      setText("");
      setPlatforms([]);
      setScheduleDate(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What would you like to share?"
        rows={4}
        className="w-full"
      />

      <MultiSelect
        options={platformOptions}
        value={platforms}
        onChange={setPlatforms}
        placeholder="Select platforms"
      />

      <DatePicker
        selected={scheduleDate}
        onChange={setScheduleDate}
        placeholderText="Schedule for later (optional)"
        showTimeSelect
        dateFormat="MMMM d, yyyy h:mm aa"
        minDate={new Date()}
      />

      {mediaUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {mediaUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Media ${index + 1}`}
              className="w-20 h-20 object-cover rounded"
            />
          ))}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!text || platforms.length === 0 || isLoading}
        className="w-full"
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {scheduleDate ? "Schedule Post" : "Post Now"}
      </Button>
    </div>
  );
}
