# MoneyWise Language Support

## Overview

MoneyWise supports multiple languages to provide a localized experience for users worldwide. The app currently supports **English**, **French**, and **Vietnamese** with a flexible architecture that makes it easy to add more languages in the future.

## Supported Languages

| Language | Code | Native Name | Status |
|----------|------|-------------|--------|
| English | `en` | English | ✅ Primary |
| French | `fr` | Français | ✅ Supported |
| Vietnamese | `vi` | Tiếng Việt | ✅ Supported |

## Architecture

### Database Design

The language support is implemented through two main tables:

#### `languages` Table
Stores metadata about supported languages:
- `code`: ISO 639-1 language code (e.g., 'en', 'fr', 'vi')
- `name`: Language name in English
- `native_name`: Language name in the language itself
- `is_rtl`: Right-to-left text direction flag
- `is_active`: Whether the language is available for selection

#### `translations` Table
Stores all localized text strings:
- `language_code`: References the language
- `key`: Translation key identifier
- `value`: Localized text
- `context`: Optional context for disambiguation

### User Preferences

Language selection is stored in the `user_preferences` table:
- `language_code`: User's selected language
- Defaults to English if not set

## Implementation Details

### Translation Keys

Translation keys follow a hierarchical structure:
- `navigation.*`: Navigation labels
- `action.*`: Common actions (add, edit, delete, etc.)
- `dashboard.*`: Dashboard screen text
- `transaction_type.*`: Transaction type labels
- `category.*`: Category names
- `settings.*`: Settings screen text

### Context System

The context field allows for disambiguation when the same key might have different meanings:
- `navigation`: Navigation-related text
- `action`: Action buttons and commands
- `dashboard`: Dashboard screen elements
- `category`: Category names and descriptions
- `settings`: Settings screen elements

### RTL Support

The system includes support for right-to-left languages:
- `is_rtl` flag in languages table
- Future-ready for Arabic, Hebrew, etc.
- UI components will automatically adjust layout

## Adding New Languages

### 1. Database Setup

```sql
-- Add new language
INSERT INTO languages (id, code, name, native_name, is_rtl, sort_order)
VALUES ('lang-es', 'es', 'Spanish', 'Español', FALSE, 4);

-- Add translations for the new language
INSERT INTO translations (id, language_code, key, value, context) VALUES
('t-es-home', 'es', 'home', 'Inicio', 'navigation'),
('t-es-budgets', 'es', 'budgets', 'Presupuestos', 'navigation'),
-- ... more translations
```

### 2. App Implementation

1. **Translation Service**: Create a service to load translations
2. **Language Selector**: Add language selection in settings
3. **Dynamic Loading**: Load translations based on user preference
4. **Fallback**: Use English as fallback for missing translations

### 3. Translation Process

1. Export all English translations
2. Translate to target language
3. Import translations back to database
4. Test with native speakers
5. Deploy with app update

## UI/UX Considerations

### Language Selection

The language selector appears in Settings:
- Shows language name in native script
- Includes flag icons for visual recognition
- Allows switching without app restart

### Text Length

Different languages have varying text lengths:
- Vietnamese: Generally longer than English
- French: Similar length to English
- UI components must accommodate longer text

### Cultural Considerations

- Date formats vary by region
- Number formatting differences
- Currency display preferences
- Cultural color associations

## Technical Implementation

### React Native Integration

```typescript
// Translation hook
const useTranslation = () => {
  const { language } = useUserPreferences();
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    loadTranslations(language);
  }, [language]);

  const t = (key: string, context?: string) => {
    return translations[`${key}${context ? `.${context}` : ''}`] || key;
  };

  return { t, language };
};
```

### Database Queries

```sql
-- Get translations for a language
SELECT key, value, context
FROM translations
WHERE language_code = ?
ORDER BY key;

-- Get user's language preference
SELECT language_code
FROM user_preferences
WHERE id = ?;
```

### Performance Optimization

- Cache translations in memory
- Lazy load translations on demand
- Use database indexes for fast lookups
- Implement translation fallbacks

## Testing Strategy

### Translation Testing

1. **Completeness**: Ensure all UI text has translations
2. **Accuracy**: Review by native speakers
3. **Context**: Verify correct context usage
4. **Length**: Test UI with longest translations

### UI Testing

1. **Layout**: Test with different text lengths
2. **RTL**: Prepare for future RTL languages
3. **Fonts**: Ensure proper font support
4. **Accessibility**: Screen reader compatibility

## Future Enhancements

### Planned Features

1. **Automatic Language Detection**: Detect device language
2. **Regional Variants**: Support for regional differences
3. **Dynamic Translation Updates**: Update translations via API
4. **User-Generated Content**: Allow users to suggest translations

### Additional Languages

Potential future languages:
- Spanish (es)
- German (de)
- Japanese (ja)
- Korean (ko)
- Arabic (ar) - RTL support
- Chinese (zh) - Simplified and Traditional

## Migration Guide

### From Single Language

1. Add language tables to database
2. Export existing English text
3. Create translation system
4. Update UI components
5. Test thoroughly

### Adding New Language

1. Add language record to database
2. Translate all UI strings
3. Test with native speakers
4. Update app store metadata
5. Deploy with app update

## Best Practices

### Translation Keys

- Use descriptive, hierarchical keys
- Keep keys consistent across languages
- Use context for disambiguation
- Document key meanings

### Database Design

- Use proper foreign key constraints
- Index frequently queried fields
- Implement soft deletes for languages
- Version control translation changes

### App Architecture

- Separate translation logic from UI
- Use dependency injection for translation service
- Implement proper error handling
- Cache translations efficiently

## Conclusion

The multi-language support in MoneyWise provides a foundation for global expansion while maintaining code simplicity and performance. The flexible architecture allows for easy addition of new languages and regional customizations.