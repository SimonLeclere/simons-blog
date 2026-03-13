import Paragraph from './paragraph'
import Pre from './pre'
import Code from './code'
import CustomImage from './image'
import Figure from './figure'
import { Table, Thead, Th, Td } from './table'
import Callout from './callout'
import Bookmark from './bookmark'
import Columns from './columns'
import Link from './link'

export const components = {
  p: Paragraph,
  pre: Pre,
  code: Code,
  img: CustomImage,
  Figure,
  table: Table,
  thead: Thead,
  th: Th,
  td: Td,
  Callout,
  Bookmark,
  Columns,
  a: Link,
}
