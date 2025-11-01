class NursingRecord(Base):
    __tablename__ = "nursing_records"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    status = Column(String)
