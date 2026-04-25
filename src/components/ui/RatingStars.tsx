import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  count?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  className,
  showText = false,
  count,
}) => {
  const safeRating = Math.min(
    maxRating,
    Math.max(0, Number.isFinite(rating) ? rating : 0)
  );
  const stars = [];
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 >= 0.5;

  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  for (let i = 1; i <= maxRating; i++) {
    if (i <= fullStars) {
      stars.push(
        <Star
          key={i}
          className={cn('fill-yellow-400 text-yellow-400', sizes[size])}
        />
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <StarHalf
          key={i}
          className={cn('fill-yellow-400 text-yellow-400', sizes[size])}
        />
      );
    } else {
      stars.push(
        <Star
          key={i}
          className={cn('text-gray-300', sizes[size])}
        />
      );
    }
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">{stars}</div>
      {showText && (
        <span className={cn('font-medium text-gray-700', size === 'sm' ? 'text-xs' : 'text-sm')}>
          {safeRating.toFixed(1)}
          {count !== undefined && (
            <span className="ml-1 text-gray-500 font-normal">
              ({count})
            </span>
          )}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
