package db

import "fmt"

func (service *DBService) GetAllSlugs() ([]string, error) {
	// We use schema.tagValues to efficiently retrieve unique tag values
	fluxQuery := fmt.Sprintf(`
        import "influxdata/influxdb/schema"
        schema.tagValues(
            bucket: "%s",
            tag: "slug",
        )`, service.bucket)

	result, err := service.QueryData(fluxQuery)
	if err != nil {
		return nil, err
	}
	defer result.Close()

	var slugs []string
	for result.Next() {
		// tagValues returns results in the "_value" column
		val := result.Record().Value()
		if s, ok := val.(string); ok {
			slugs = append(slugs, s)
		}
	}

	return slugs, result.Err()
}
