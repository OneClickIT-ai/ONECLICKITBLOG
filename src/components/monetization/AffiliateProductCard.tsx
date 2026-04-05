import Image from 'next/image'
import { urlFor } from '@/sanity/image'
import type { Product } from '@/types/sanity'

export function AffiliateProductCard({ product }: { product: Product }) {
  return (
    <div className="relative rounded-xl border border-gray-200 p-5 dark:border-gray-800">
      {product.badge && (
        <span className="absolute -top-3 left-4 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-medium text-white">
          {product.badge.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
        </span>
      )}

      <div className="flex flex-col gap-4 sm:flex-row">
        {product.image?.asset && (
          <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900">
            <Image
              src={urlFor(product.image).width(256).height(256).url()}
              alt={product.name}
              fill
              className="object-contain p-2"
              sizes="128px"
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-bold">{product.name}</h3>
          {product.price && (
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {product.price}
            </span>
          )}
          {product.rating && (
            <div className="mt-1 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={i < product.rating! ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                >
                  ★
                </span>
              ))}
              <span className="ml-1 text-sm text-gray-500">{product.rating}/5</span>
            </div>
          )}

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {product.pros && product.pros.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase text-green-600">Pros</h4>
                <ul className="mt-1 space-y-1 text-sm">
                  {product.pros.map((pro, i) => (
                    <li key={i} className="text-gray-600 dark:text-gray-400">+ {pro}</li>
                  ))}
                </ul>
              </div>
            )}
            {product.cons && product.cons.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase text-red-600">Cons</h4>
                <ul className="mt-1 space-y-1 text-sm">
                  {product.cons.map((con, i) => (
                    <li key={i} className="text-gray-600 dark:text-gray-400">- {con}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {product.verdict && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{product.verdict}</p>
          )}

          {product.affiliateUrl && (
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="mt-3 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Check Price
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
