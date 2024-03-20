package utils

import (
	"testing"
)

// Test cases for the toSlug function
func TestToSlug(t *testing.T) {
	cases := []struct {
		name     string
		input    string
		expected string
	}{
		{"Czech characters", "čřž ďťň áóůú", "crz-dtn-aouu"},
		{"Mixed case", "Příliš Žluťoučký Kůň", "prilis-zlutoucky-kun"},
		{"Special characters", "#$hello&*world$", "helloworld"},
		{"English characters", "The quick brown fox", "the-quick-brown-fox"},
		{"Real World data", "České Budějovice Ústí nad Labem", "ceske-budejovice-usti-nad-labem"},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			got := toSlug(c.input)
			if got != c.expected {
				t.Errorf("toSlug(%q) == %q, want %q", c.input, got, c.expected)
			}
		})
	}
}
