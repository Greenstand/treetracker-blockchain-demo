import Link from 'next/link';
import { Coins, TrendingUp, Droplet, Wind, Leaf } from 'lucide-react';
import { ImpactToken } from '@/types';
import { formatDate, getStatusColor, getStatusBadgeText } from '@/lib/utils';

interface TokenCardProps {
  token: ImpactToken;
}

export default function TokenCard({ token }: TokenCardProps) {
  return (
    <Link href={`/tokens/${token.id}`}>
      <div className="bg-white rounded-xl shadow-md p-6 card-hover">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {token.treeSpecies || 'Unknown Species'}
              </h3>
              <p className="text-sm text-gray-500">Token ID: {token.id}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(token.state)}`}>
            {getStatusBadgeText(token.state)}
          </div>
        </div>

        {/* Token Value */}
        <div className="mb-4 p-4 bg-gradient-to-r from-primary-50 to-green-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Token Value</p>
          <p className="text-3xl font-bold text-primary-600">{token.value.toFixed(2)}</p>
        </div>

        {/* Ecological Value */}
        <div className="space-y-3 mb-4">
          <h4 className="text-sm font-semibold text-gray-700">Ecological Impact</h4>
          
          {token.ecologicalValue.carbonOffset && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wind className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Carbon Offset</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {token.ecologicalValue.carbonOffset} kg CO₂
              </span>
            </div>
          )}

          {token.ecologicalValue.waterRetention && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Droplet className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Water Retention</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {token.ecologicalValue.waterRetention} L
              </span>
            </div>
          )}

          {token.ecologicalValue.biodiversityScore && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Leaf className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Biodiversity Score</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {token.ecologicalValue.biodiversityScore}/10
              </span>
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Issued</span>
            <span className="text-gray-900 font-medium">{formatDate(token.issuedDate)}</span>
          </div>
          {token.maturityDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Matured</span>
              <span className="text-gray-900 font-medium">{formatDate(token.maturityDate)}</span>
            </div>
          )}
        </div>

        {/* Blockchain Info */}
        {token.blockchainTxId && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Blockchain TX</span>
              <span className="text-xs font-mono text-gray-700 truncate max-w-[150px]">
                {token.blockchainTxId}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}