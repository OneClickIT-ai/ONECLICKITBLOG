import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import Image from 'next/image'
import { urlFor } from '@/sanity/image'

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mb-4 mt-8 text-2xl font-bold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-6 text-xl font-bold">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 mt-4 text-lg font-semibold">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">{children}</code>
    ),
    highlight: ({ children }) => (
      <mark className="bg-yellow-200 px-0.5 dark:bg-yellow-900">{children}</mark>
    ),
    link: ({ children, value }) => {
      const rel = value?.isAffiliate
        ? 'nofollow sponsored noopener noreferrer'
        : 'noopener noreferrer'
      return (
        <a
          href={value?.href}
          target="_blank"
          rel={rel}
          className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src={urlFor(value).width(1200).url()}
              alt={value.alt || ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    codeBlock: ({ value }) => (
      <pre className="my-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
        <code>{value.code}</code>
      </pre>
    ),
  },
}

export function PortableTextRenderer({ value }: { value: PortableTextBlock[] }) {
  if (!value) return null
  return (
    <div className="prose-custom">
      <PortableText value={value} components={components} />
    </div>
  )
}
