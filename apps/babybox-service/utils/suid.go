package utils

import (
	"fmt"

	"github.com/teris-io/shortid"
)

func GenerateSUID(prefix string) (string, error) {
	id, err := shortid.Generate()
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s%s", prefix, id), nil
}
