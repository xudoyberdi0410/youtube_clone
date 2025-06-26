import React from 'react'
import TrendingIconSvg from "./TrendingIcon.svg"
import GaminIconSvg from "./GaminIcon.svg"
import HistoryIconSvg from "./HistoryIcon.svg"
import HomeIconSvg from "./HomeIcon.svg"
import HumbergerMenuIconSvg from "./HumbergerMenuIcon.svg"
import LearningIconSvg from "./LearningIcon.svg"
import LiveIconSvg from "./LiveIcon.svg"
import MusicIconSvg from "./MusicIcon.svg"
import NewsIconSvg from "./NewsIcon.svg"
import SearchIconSvg from "./SearchIcon.svg"
import ShortsIconSvg from "./ShortsIcon.svg"
import SportsIconSvg from "./SportsIcon.svg"
import SubscriptionsIconSvg from "./SubscriptionsIcon.svg"
import ThreeDotsIconSvg from "./ThreeDotsIcon.svg"
import UserCircleIconSvg from "./UserCircleIcon.svg"

type SvgComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

// Create wrapper components to ensure proper React component behavior
export const TrendingIcon = (props: React.SVGProps<SVGSVGElement>) => React.createElement(TrendingIconSvg as SvgComponent, props)
export const GaminIcon = (props: React.SVGProps<SVGSVGElement>) => React.createElement(GaminIconSvg as SvgComponent, props)
export const HistoryIcon = (props: React.SVGProps<SVGSVGElement>) => React.createElement(HistoryIconSvg as SvgComponent, props)
export const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => React.createElement(HomeIconSvg as SvgComponent, props)
export const HumbergerMenuIcon = (props: React.SVGProps<SVGSVGElement>) => React.createElement(HumbergerMenuIconSvg as SvgComponent, props)
export const LearningIcon = (props: React.SVGProps<SVGSVGElement>) => React.createElement(LearningIconSvg as SvgComponent, props)
export const LiveIcon = (props: React.SVGProps<SVGSVGElement>) => React.createElement(LiveIconSvg as SvgComponent, props)
export const MusicIcon = (props: React.SVGProps<SVGSVGElement>) => React.createElement(MusicIconSvg as SvgComponent, props)
export const NewsIcon = (props: React.SVGProps<SVGSVGElement>) => React.createElement(NewsIconSvg as SvgComponent, props)
export const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => React.createElement(SearchIconSvg as SvgComponent, props)
export const ShortsIcon = (props: React.SVGProps<SVGSVGElement>) => React.createElement(ShortsIconSvg as SvgComponent, props)
export const SportsIcon = (props: React.SVGProps<SVGSVGElement>) => React.createElement(SportsIconSvg as SvgComponent, props)
export const SubscriptionsIcon = (props: React.SVGProps<SVGSVGElement>) => React.createElement(SubscriptionsIconSvg as SvgComponent, props)
export const ThreeDotsIcon = (props: React.SVGProps<SVGSVGElement>) => React.createElement(ThreeDotsIconSvg as SvgComponent, props)
export const UserCircleIcon = (props: React.SVGProps<SVGSVGElement>) => React.createElement(UserCircleIconSvg as SvgComponent, props)