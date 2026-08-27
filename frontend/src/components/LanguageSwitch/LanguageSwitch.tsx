import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { APP_LOCALES, LOCALE_LABELS, type AppLocale } from '../../i18n/locale'
import { useLocale } from '../../i18n/LocaleContext'
import './LanguageSwitch.scss'

export function LanguageSwitch() {
  const { locale, setLocale, ui } = useLocale()

  return (
    <ToggleButtonGroup
      className="LanguageSwitch"
      exclusive
      size="small"
      value={locale}
      onChange={(_event, nextLocale: AppLocale | null) => {
        if (nextLocale !== null) {
          setLocale(nextLocale)
        }
      }}
      aria-label={ui.languageLabel}
      sx={{
        width: 'fit-content',
        alignSelf: 'flex-start',
        backgroundColor: '#1A1208',
      }}
    >
      {APP_LOCALES.map((option) => (
        <ToggleButton
          key={option}
          value={option}
          className="LanguageSwitchButton"
          sx={{
            color: '#FFFFFF',
            backgroundColor: '#1A1208',
            borderColor: '#FFFFFF66',
            lineHeight: 1.5,
            textTransform: 'none',
            letterSpacing: '0.4px',
            width: '108px',
            boxSizing: 'border-box',
            whiteSpace: 'nowrap',
            fontWeight: 400,
            ':hover': {
              backgroundColor: '#1A1208',
            },
            '&.Mui-selected': {
              color: '#1A1208',
              backgroundColor: '#FFFFFF',
              fontWeight: 400,
            },
            '&.Mui-selected:hover': {
              color: '#1A1208',
              backgroundColor: '#FFFFFF',
            },
            '&.Mui-selected.Mui-focusVisible': {
              color: '#1A1208',
              backgroundColor: '#FFFFFF',
            },
          }}
        >
          {LOCALE_LABELS[option]}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}
