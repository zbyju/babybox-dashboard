package utils

import (
	"fmt"
	"math/rand/v2"
	"time"
)

func GenerateMID(t time.Time) string {
	id, err := GenerateSUID("")
	if err != nil {
		id = fmt.Sprintf("%d", rand.IntN(100))
	}

	return fmt.Sprintf("%s_%s", t.Format("2006-01-02"), id)
}
