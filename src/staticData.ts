import type { SelectProps } from "antd";

export const tagOptions: SelectProps["options"] = [
  "Family",
  "Friends",
  "Work",
  "Relatives",
  "Nobody",
].map((tag: string) => ({ label: tag, value: tag.toLocaleLowerCase() }));
