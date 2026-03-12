import { defineArrayMember, defineField, defineType } from "sanity";

export const timelineEventType = defineType({
  name: "timelineEvent",
  title: "Timeline Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(6),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 120 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "topic",
      title: "Topic",
      type: "reference",
      to: [{ type: "topic" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "update",
      title: "Update",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eventAt",
      title: "Event time",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sourceLinks",
      title: "Source links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
        }),
      ],
    }),
  ],
});
