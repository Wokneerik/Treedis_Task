'use client'

import { Search, X } from 'lucide-react'
import { useState } from 'react'

interface NavigationMenuProps {
	onTeleport: () => void
	onNavigate: () => void
}

const Menu = ({ onTeleport, onNavigate }: NavigationMenuProps) => {
	const [searchQuery, setSearchQuery] = useState('')

	return (
		<div className='fixed top-0 right-0'>
			<div className='absolute top-2 right-2 w-52 bg-black text-white shadow-xl p-3 rounded-md flex flex-col pointer-events-auto'>
				{/* Header */}
				<div className='flex items-center justify-between mb-2'>
					<span className='text-sm font-semibold'>Menu</span>
					<div className='flex items-center gap-4'>
						<Search size={18} className='cursor-pointer' />
						<X size={20} className='cursor-pointer' />
					</div>
				</div>

				{/* Search Bar */}
				<div className='relative mb-2'>
					<input
						type='text'
						placeholder='Search...'
						className='w-full pl-8 pr-3 py-1 border border-gray-600 rounded-md bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gray-500'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
				</div>

				{/* Buttons */}
				<div>
					<button
						onClick={onTeleport}
						className='w-full px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-all duration-200 mb-1 text-sm'
					>
						Teleport to Office
					</button>
				</div>

				<div>
					<button
						onClick={onNavigate}
						className='w-full px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-all duration-200 text-sm'
					>
						Navigate to Office
					</button>
				</div>
			</div>
		</div>
	)
}

export default Menu
