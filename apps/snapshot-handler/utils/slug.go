package utils

import "strings"

// toSlug converts a Czech string to a slugified version, with Czech characters converted to English.
func ToSlug(s string) string {
	charMap := map[rune]string{
		'č': "c", 'ď': "d", 'ě': "e", 'ň': "n",
		'ř': "r", 'š': "s", 'ť': "t", 'ů': "u",
		'ž': "z", 'á': "a", 'í': "i", 'é': "e",
		'ý': "y", 'ú': "u", 'ó': "o",
	}

	// Convert the string to lowercase
	slug := strings.ToLower(s)

	// Map the special characters using the charMap
	var mappedChars []rune
	for _, char := range slug {
		if replacement, ok := charMap[char]; ok {
			mappedChars = append(mappedChars, []rune(replacement)...)
		} else {
			mappedChars = append(mappedChars, char)
		}
	}

	// Replace spaces with dashes and remove non-alphanumeric characters (except dash)
	slug = strings.Join(strings.Fields(string(mappedChars)), "-")
	slug = strings.Map(func(r rune) rune {
		if strings.ContainsRune("abcdefghijklmnopqrstuvwxyz0123456789-", r) {
			return r
		}
		return -1
	}, slug)

	return slug
}
