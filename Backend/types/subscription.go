package types

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SubscriptionPlanType int

const (
	Free SubscriptionPlanType = iota
)

type Subscription struct {
	ID      primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
	UserID  primitive.ObjectID   `bson:"userID" json:"-"`
	Plan    SubscriptionPlanType `bson:"plan" json:"plan"`
	EndDate time.Time            `bson:"endDate" json:"endDate"`
}

type CreateSubscriptionParams struct {
	UserID  primitive.ObjectID   `json:"userID"`
	Plan    SubscriptionPlanType `json:"plan"`
	EndDate time.Time            `json:"endDate"`
}

type UpdateSubscriptionParams struct {
	Plan    SubscriptionPlanType `json:"plan"`
	EndDate time.Time            `json:"endDate"`
}

func (p UpdateSubscriptionParams) ToBSON() map[string]string {
	m := map[string]string{"endDate": p.EndDate.String()}
	switch p.Plan {
	case Free:
		m["plan"] = "free"
	}
	return m
}

func NewSubscriptionFromParams(params CreateSubscriptionParams) (*Subscription, error) {
	return &Subscription{
		UserID:  params.UserID,
		Plan:    params.Plan,
		EndDate: params.EndDate,
	}, nil
}
