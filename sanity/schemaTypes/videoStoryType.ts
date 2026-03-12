import { defineField, defineType } from "sanity";

export const videoStoryType = defineType({
  name: "videoStory",
  title: "Video Story",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(8),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 120 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(30),
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }).custom((value) => {
          if (!value) {
            return "YouTube URL is required";
          }

          const isYoutube = /(?:youtube\.com|youtu\.be)/i.test(value);
          return isYoutube ? true : "Please add a valid YouTube URL";
        }),
    }),
    defineField({
      name: "source",
      title: "Source / Channel",
      type: "string",
      initialValue: "Byte Bulletin",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured video",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
