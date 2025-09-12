// const SevenEmojiRow: React.FC<EmojiRowProps> = ({ name, selectedValue, onSelect }) => {
//     return (
//       <div className="scale-row" role="radiogroup" aria-label={name}>
//         {SEVEN_POINT_MOODS.map((mood) => {
//           const isSelected = selectedValue === mood.value;
//           return (
//             <button
//               key={mood.value}
//               type="button"
//               role="radio"
//               aria-checked={isSelected}
//               className={`p-4 ${mood.color}${isSelected ? ' selected' : ''}`}
//               onClick={() => onSelect(mood.value)}
//             >
//               <span>{mood.emoji}</span>
//               <p>{mood.label}</p>
//             </button>
//           );
//         })}
//       </div>
//     );
//   };
  
//   const FiveEmojiRow: React.FC<EmojiRowProps> = ({ name, selectedValue, onSelect}) => {
//     return (
//     <div className="scale-row" role="radiogroup" aria-label={name}>
//         {FIVE_POINT_MOODS.map((mood) => {
//           const isSelected = selectedValue === mood.value;
//           return (
//             <button
//               key={mood.value}
//               type="button"
//               role="radio"
//               aria-checked={isSelected}
//               className={`p-4 ${mood.color}${isSelected ? ' selected' : ''}`}
//               onClick={() => onSelect(mood.value)}
//             >
//               <span>{mood.emoji}</span>
//               <p>{mood.label}</p>
//             </button>
//           );
//         })}
//       </div>);
//   }