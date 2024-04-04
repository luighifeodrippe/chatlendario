import { FC } from "react"

interface ChatbotUISVGProps {
  theme: "dark" | "light"
  scale?: number
}

export const ChatbotUISVG: FC<ChatbotUISVGProps> = ({ theme, scale = 1 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={375 * scale}
      height={375 * scale}
      viewBox="0 0 375 375"
      fill="none"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <clipPath id="clip0">
          <path d="M0 0h375v375H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#clip0)">
        <path
          fill="#fff"
          d="M201.312 225.363h123.443V348.806h-123.443z"
          transform="translate(201.311 225.363)"
        />
        <path
          fill="#fff"
          d="M225.177 225.363h123.443V348.806h-123.443z"
          transform="translate(225.177 225.363)"
        />
        <path
          d="M62.289 0h15.836L48.32-84.004H31.379L1.57 0h15.489l7.16-21.715h30.91zM39.469-69.16h.41l11.7 35.859H27.71z"
          fill="#fff"
          transform="translate(249.069 225.363)"
        />
        <path
          d="M31.086-84.004H1.34v10.828h15.777v80.336H1.34v10.828H31.086z"
          fill="#fff"
          transform="translate(328.755 225.363)"
        />
        <path
          fill="#fff"
          d="M267.105 143.484l-20.125-7.5-2.27-.844a.751.751 0 00-.738 1.398l1.004.371-28.105 74.344a4.74 4.74 0 002.66 5.993 4.712 4.712 0 005.386-2.384l18.758-50.282h.007l9.344-24.05 1.008.375a.748.748 0 00.414.08.75.75 0 00.328-1.406zM253.758 168.488l-15.332-5.715 8.875-23.797 15.332 5.719z"
          fill-opacity="1"
          fill-rule="nonzero"
        />
        <path
          d="M265.605 129.242a3.756 3.756 0 00-4.82-3.602 3.743 3.743 0 00-2.723 2.723 3.756 3.756 0 003.602 4.82 3.74 3.74 0 002.723-2.723 3.756 3.756 0 00.218-1.218z"
          fill-opacity="1"
          fill-rule="nonzero"
        />
        <path
          d="M255.355 108.684a4.775 4.775 0 00-4.777 4.773 4.775 4.775 0 004.773 4.777 4.775 4.775 0 004.777-4.773 4.775 4.775 0 00-4.773-4.777z"
          fill-opacity="1"
          fill-rule="nonzero"
        />
        <path
          d="M54.91-13.035H22.004v-62.211H6.258v75.246h48.652z"
          fill="#fff"
          transform="translate(9.669 225.605)"
        />
        <path
          d="M26.543-10.117c-5.164 0-8.606-2.605-8.606-6.777 0-3.965 3.234-6.52 8.918-6.938l11.785-.73v-3.07c0-6.047-5.477-10.375-12.098-10.375zm-5.008 10.003c6.988 0 13.926-3.492 17.055-9.438h.313v8.55h14.703v-38.43c0-11.266-9.332-18.672-23.672-18.672-14.812 0-24.043 7.457-24.613 18.305h13.922c.73-4.121 4.328-6.934 10.012-6.934 5.734 0 9.386 3.023 9.386 8.238v3.703H24.562c-13.926.836-21.746 6.727-21.746 15.895 0 11.066 7.922 16.949 18.559 16.949z"
          fill="#fff"
          transform="translate(62.194 225.605)"
        />
        <path
          d="M38.172.887c14.078 0 22.683-10.848 22.683-28.836 0-18.043-8.656-28.836-22.738-28.836-7.977 0-14.184 4.961-17.258 11.582h-.313v-28.043H5.32v75.246h15.016v-9.594h.313c3.078 6.516 9.336 10.48 17.523 10.48zm-5.27-44.473c7.562 0 12.359 6.468 12.359 16.636 0 10.219-4.746 16.582-12.359 16.582-7.402 0-12.41-6.465-12.41-16.582 0-10.011 5.058-16.636 12.41-16.636z"
          fill="#fff"
          transform="translate(115.188 225.605)"
        />
        <path
          d="M11.875-84h30.687v10.828H27.785v80.336h14.777v10.828H11.875z"
          fill="#fff"
          transform="translate(170.846 223.58)"
        />
      </g>
    </svg>
  )
}
